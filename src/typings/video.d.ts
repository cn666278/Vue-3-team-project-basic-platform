declare namespace video {
    interface videoListInfo {
        FileCount: number;
        FileList: videoFileList[];
        FileByBinary: Function;
        SerialNumber: number;
    }
    
    interface videoFileList {
        Alarm: {
            low: number;
            hight: number;
            unsigned: boolean;
        };
        Channel: number;
        MediaType: number;
        StorageType: number;
        StreamType: number;
        StartTime: string;
        EndTime: string;
        FileSize: number;
        FileByBinary: Function;
    }
}