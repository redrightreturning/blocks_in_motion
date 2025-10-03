import { ArrowDownOnSquareIcon, Cog6ToothIcon, BackwardIcon, ForwardIcon, PlayIcon, StopIcon, XMarkIcon } from "@heroicons/react/24/solid";

export type IconType = 
"settings" |
"play" |
"stop" |
"forward" |
"backward" | 
"download" | 
"x"

export default function Icon({type} : {type : IconType}){

    const className = "w-5 h-5"

    switch(type){
        case "settings": return <Cog6ToothIcon className={className}/>
        case "play": return <PlayIcon className={className}/>
        case "stop": return <StopIcon className={className}/>
        case "forward": return <ForwardIcon className={className}/>
        case "backward": return <BackwardIcon className={className}/>
        case "download": return <ArrowDownOnSquareIcon className={className}/>
        case "x": return <XMarkIcon className={className}/>
    }
}