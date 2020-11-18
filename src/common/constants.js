import logo from '../assets/images/spacex-logo.png';
import launchHomeImage from '../assets/images/launch-home.png';
import launchHomeImageX2 from '../assets/images/launch-home@2x.png';
import launchHomeImageX3 from '../assets/images/launch-home@3x.png';

const CONSTANTS = {
    LOGO: logo,
    SPACE_X_IMAGE: launchHomeImage,
    SPACE_X_RETINA_IMAGES: `${launchHomeImage} 1x, ${launchHomeImageX2} 2x, ${launchHomeImageX3} 3x`,
    SPACE_X_API: 'https://api.spacexdata.com/v3/launches'
};

export default CONSTANTS;
