
import { environment } from '../environments/environment';

export class Configs {

    public static mapsApiKey = 'AIzaSyDJZg-8VIJfJlZiuoyCC_HKNyvFyPXYen4';
    public static googleAuth = environment.baseUrl + '/auth/google';
    public static loginUrl = environment.baseUrl + '/login';
    public static registerUrl = environment.baseUrl + '/register';
    public static planningsUrl = environment.baseUrl + '/plannings';
    public static placesAutocompleteUrl = environment.baseUrl + '/places/autocomplete';
    public static placesSearchUrl = environment.baseUrl + '/places/search';
    public static placesDetailsUrl = environment.baseUrl + '/places/details';
    public static placesPhotoUrl = environment.baseUrl + '/places/photo';
    public static placesDistanceUrl = environment.baseUrl + '/places/distance';

    public static fileUrl = environment.baseUrl + '/file';
    // public static fileGetImagesUrl = environment.baseUrl + '/file/images';
    
    public static shareUrl = environment.baseUrl + '/share';
}