import shortid from 'shortid';

class ShortenLinkGenerator {

    generate() {
       return shortid.generate()
    }
}

export default new ShortenLinkGenerator();