import { generate } from 'shortid';

class ShortenLinkGenerator {

    generate() {
       return generate()
    }
}

export default new ShortenLinkGenerator();