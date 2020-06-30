package ua.kiev.minaeva.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.service.ReaderService;

@Component
public class CustomReaderDetailsService implements UserDetailsService {

    private ReaderService readerService;

    @Autowired
    CustomReaderDetailsService(@Lazy ReaderService readerService) {
        this.readerService = readerService;
    }

    @Override
    public CustomReaderDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            ReaderDto readerDto = readerService.getByEmail(email);
            return CustomReaderDetails.fromReaderDtoToCustomUserDetails(readerDto);
        } catch (BoobookNotFoundException e) {
            throw new UsernameNotFoundException(e.getMessage(), e);
        }
    }

}
