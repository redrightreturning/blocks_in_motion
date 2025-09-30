import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function NoiseEffect(){
    return(
        <EffectComposer>
                <Noise
                    opacity={0.4}
                    premultiply
                    blendFunction={BlendFunction.ADD}
                />
                <Bloom mipmapBlur luminanceThreshold={1} />
                <Vignette
                    offset={0.5} // vignette offset
                    darkness={0.5} // vignette darkness
                    eskil={false} // Eskil's vignette technique
                    blendFunction={BlendFunction.NORMAL} // blend mode
                />
            </EffectComposer>
    )
}