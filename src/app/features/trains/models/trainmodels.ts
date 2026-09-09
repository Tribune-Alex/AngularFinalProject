export interface Train {
    id: number;
    number: number;
    name: string;
    thumbnail: string;
    coachesCount: number;
    totalSeats: number;
  }
   
  export interface Schedule {
    id: number;
    origin: string;
    destination: string;
    departureTime: string;
    trainId: number;
    trainName: string;
    trainNumber: number;
  }
   
  export interface Coach {
    id: number;
    number: number;
    class: string;
    price: number;
    trainId: number;
    seatCount: number;
  }
   
  export interface TrainDetails extends Train {
    schedules: Schedule[];
    coaches: Coach[];
  }
   
  export interface TrainsResponse {
    data: {
      items: Train[];
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
      hasMore: boolean;
    };
  }
   
  export interface TrainDetailsResponse {
    data: TrainDetails;
  }


  export interface Station {
    id: number;
    name: string;
  }
  
  export interface StationsResponse {
    data: Station[];
  }