export const base_api_url = 'http://127.0.0.1:5000'
export const token_dentifier = '85OV3BuseJBDX2IKAx7SJi0FGww'
export const clipboard_identifier = 'ls_clipboard'
export const clipboard_action_identifier = 'clip_action'
export const grid_pref_identifier= 'grid_pref'
export const postLoginPage = '/'
export const safe_separator='#'
export const live_separator='/'
export const GlobalWebName='TestWeb'
export const GlobalTitlePrefix = ' | '+GlobalWebName



export function parseSafePath(initPath:string){

    return initPath.split(/[\\/#]+/)
      
}


export function getSafePath(initPath:string){
    return initPath.split(/[\\/#]+/).join(safe_separator)
}