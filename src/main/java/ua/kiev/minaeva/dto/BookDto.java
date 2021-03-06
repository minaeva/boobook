package ua.kiev.minaeva.dto;

import lombok.Data;

@Data
public class BookDto {

    private Long id;
    private String title;
    private Long authorId;
    private String authorName;
    private String authorSurname;

    private Long ownerId;
    private String ownerName;

    private String publisher;
    private int year;

    private Integer ageGroup;
    private Integer cover;
    private Integer language;
    private Integer illustrations;
    private int pagesQuantity;
    private String description;
    private boolean isActive = true;

    public static class Builder {

        private BookDto newBookDto;

        public Builder(String title, Long authorId, Long ownerId) {
            newBookDto = new BookDto();
            newBookDto.title = title;
            newBookDto.authorId = authorId;
            newBookDto.ownerId = ownerId;
        }

        public  Builder withAuthorName(String authorName) {
            newBookDto.authorName = authorName;
            return this;
        }

        public  Builder withAuthorSurname(String authorSurname) {
            newBookDto.authorSurname = authorSurname;
            return this;
        }

        public Builder withYear(int year) {
            newBookDto.year = year;
            return this;
        }

        public Builder withPublisher(String publisher) {
            newBookDto.publisher = publisher;
            return this;
        }

        public Builder withAgeGroup(int ageGroup) {
            newBookDto.ageGroup = ageGroup;
            return this;
        }

        public Builder withDescription(String description) {
            newBookDto.description = description;
            return this;
        }

        public Builder withHardCover(int cover) {
            newBookDto.cover = cover;
            return this;
        }

        public Builder withLanguage(int language) {
            newBookDto.language = language;
            return this;
        }

        public Builder withIllustrations(int illustrations) {
            newBookDto.illustrations = illustrations;
            return this;
        }

        public Builder withPagesQuantity(int pagesQuantity) {
            newBookDto.pagesQuantity = pagesQuantity;
            return this;
        }

        public Builder withActive(boolean active) {
            newBookDto.isActive = active;
            return this;
        }

        public BookDto build() {
            return newBookDto;
        }

    }
}
