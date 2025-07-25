export interface IInstagramExplore {
    pills: IPills[]
    fit_sections: IFitSections[]
}

export interface IPills {
    name: string;
    fit_id: string;
}

export interface IFitSections {
    l1: IL1
    subtopic: ISubTopic[]
}

export interface IL1 {
    name: string;
    fit_id: string;
}

export interface ISubTopic {
    fit_id: string;
    name: string;
    medias: {
        display_uri: string
    }[]
}


export interface ITopic {
    id: string;
    hashtags: string[]
    commentsCount: number
    likesCount: number
    url: string
    displayUrl: string
    topicName: string
}

export interface ILocation {
    name: string;
    location_list: ILocationInfo[];
    country_info: ILocationInfo
    city_info: ILocationInfo
    country_list?: ILocationInfo[]
    city_list?: ILocationInfo[]
    posts: ILocationPost[]
}

export interface ILocationInfo {
    id: string;
    name: string;
    slug: string;
}

export interface ILocationPost {
    id: string;
    display_uri: string
    like_count: number
    comment_count: number
}