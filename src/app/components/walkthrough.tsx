import Image from "next/image";
import Logo from "./logo";
import { usePointerType } from "../helpers/usePointerType";
import Button from "./ui/button";

export function WalkthroughPageOne(){
    return(
        <div className="text-white">
            <span className="flex flex-row items-center justify-center font-bold"> <Logo/> <h1>—Boxes in Motion</h1> </span>
            <Image src="/BiMInterface_demo.gif" alt="Boxes in Motion Interface Demo" width={400} height={300}/>
            <br/>
            <p>Boxes in motion is a voxel animator using frame-by-frame animation.</p>
            <br/>
            <p>You add boxes in each frame, and when you play it back, the boxes combine to show motion</p>
        </div>
    )
}

export function WalkthroughPageTwo(){

    const isTouch = usePointerType();

    return(
        <div className="text-white">
            <h2 className="font-bold text-center my-6">Getting Started</h2>
            <ol className="list-disc">
                <li>In the main window, {isTouch? "drag with one finger" : "click and drag"} to rotate the working area</li>
                <li>{isTouch? "Use two fingers" : "Hold &#8984; (or ctrl on PC) and click"} to pan up, down, left, and right</li>
                <li>Pinch with two fingers to zoom in and out {isTouch? "" : "or use the scroll wheel if using a mouse."}</li>
                <li>{isTouch?"Touch" : "Click"} to add boxes.</li>
            </ol>
            <br/>
            <p>When you're happy with the frame, add or duplicate in the timeline</p>
            <Image className="my-3" src="/BiMInterface_timeline.gif" alt="The timeline interface adding/deleting/duplicating frames" width="346" height="200" />
            <p>Playback to see the animation and when you're finished, download your animation as a gif.</p>

        </div>
    )
}

export function WalkthroughPageThree(){
    return(
        <div className="text-white">
            <span className="flex flex-row items-center justify-center font-bold"> <Logo/> <h1>—Boxes in Motion</h1> </span>
            <h2 className="font-bold">Thank you for trying Boxes in Motion!<br/> This is an ongoing project so if you have any feedback or suggestions, please get in touch!</h2>
            <div className="my-4 flex flex-row justify-center items-center">
                <Button>
                    <a href="https://github.com/redrightreturning/blocks_in_motion" target="_blank">Project Page</a>
                </Button>
            </div>
        </div>
    )
}