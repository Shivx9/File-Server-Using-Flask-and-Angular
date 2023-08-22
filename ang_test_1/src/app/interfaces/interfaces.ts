export interface Item{
    type: 'domain' | 'file' | 'folder',
    name:string,
    id:string | number
}


export interface contextMenuItem{
    name: 'rename' | 'download' | 'copy' | 'cut' | 'paste' | 'open' | 'delete' 
}

export interface selfContextItem{
    type:'item' | 'directory',
    keyRef:string | number,     // Eg. domain ID
    refInfo?:object       // Optional | Eg. {dir:"some#directory#path", method:"copy"}
}