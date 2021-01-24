package ua.kiev.minaeva.controller.helper;

import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;
import ua.kiev.minaeva.exception.BoobookValidationException;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

public class ImageHelper {

    private static final int TARGET_WIDTH = 1000;
    private static final int TARGET_HEIGHT = 600;

    public static byte[] resizeEncode(MultipartFile file) throws IOException, BoobookValidationException {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        byte[] originalImage = file.getBytes();

        BufferedImage image;
        try (ByteArrayInputStream in = new ByteArrayInputStream(originalImage)) {
            image = ImageIO.read(in);
        }

        BufferedImage resizedImage = fitImage(image, TARGET_WIDTH, TARGET_HEIGHT);

        byte[] resizedImageArray;
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(resizedImage, extension, outputStream);
            resizedImageArray = outputStream.toByteArray();
        }

        return Base64.getEncoder().encode(resizedImageArray);
    }

    private static BufferedImage fitImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        if (originalImage.getWidth() <= targetWidth && originalImage.getHeight() <= targetHeight) {
            return originalImage;
        }

        if (originalImage.getHeight() > originalImage.getWidth()) { //vertical image => recalculate width
            targetWidth = (targetHeight * originalImage.getWidth()) / originalImage.getHeight();
        } else { //horizontal => target width is given, target height is recalculated
            targetHeight = (targetWidth * originalImage.getHeight()) / originalImage.getWidth();
        }

        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics2D = resizedImage.createGraphics();
        graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        graphics2D.dispose();
        return resizedImage;
    }


}
