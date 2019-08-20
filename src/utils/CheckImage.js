import ImageDefault from '../assets/image/carouselGroup/carousel2.jpg';
import LogoDefault from '../assets/image/carouselGroup/carousel1.jpg';

export const testImage = (defaultImage, type) => {
    if (defaultImage !== null) {
        return defaultImage;
    } else {
        if (type === 'logo') {
            return LogoDefault
        }
    }

    return ImageDefault;
}