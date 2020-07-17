package ua.kiev.minaeva.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ua.kiev.minaeva.dto.ReaderDto;

import java.util.Collection;
import java.util.Collections;

public class CustomReaderDetails implements UserDetails {

    public static final String ROLE_READER = "ROLE_READER";
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> grantedAuthorities;

    public static CustomReaderDetails fromReaderDtoToCustomUserDetails(ReaderDto readerDto){
        CustomReaderDetails details = new CustomReaderDetails();
        details.email = readerDto.getEmail();
        details.password = readerDto.getPassword();
        details.grantedAuthorities = Collections.singletonList(new SimpleGrantedAuthority(ROLE_READER));
        return details;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return grantedAuthorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
