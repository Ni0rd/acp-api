export type Lang = 'fr' | 'en';

export type Location = {
  title: string;
  address: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
};

export type File = {
  title: string;
  url: string;
};
