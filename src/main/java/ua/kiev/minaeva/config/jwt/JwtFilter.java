package ua.kiev.minaeva.config.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;
import ua.kiev.minaeva.config.CustomReaderDetails;
import ua.kiev.minaeva.config.CustomReaderDetailsService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

import static ua.kiev.minaeva.controller.helper.JwtHelper.AUTHORIZATION;
import static ua.kiev.minaeva.controller.helper.JwtHelper.getJwtFromString;

@Component
@RequiredArgsConstructor
@Log
public class JwtFilter extends GenericFilterBean {

    private final JwtProvider jwtProvider;
    private final CustomReaderDetailsService customReaderDetailsService;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        log.info("log: doing filter");

        String jwt = getTokenFromRequest((HttpServletRequest) servletRequest);
        if (jwt != null && jwtProvider.validateToken(jwt)) {
            String userEmail = jwtProvider.getEmailFromToken(jwt);
            CustomReaderDetails details = customReaderDetailsService.loadUserByUsername(userEmail);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader(AUTHORIZATION);
        return getJwtFromString(bearer);
    }

}
