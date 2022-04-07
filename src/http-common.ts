import axios from "axios";

export default axios.create({
    baseURL: 'https://deep-index.moralis.io/api/v2',
    headers: {
        'X-API-Key': 'N3hlBi2DjKnfflVH8koX0A4ODRrvI9V9Nc5cFAm9A5ih48cvPlbX6bI23W8sKmHc'
    }
});