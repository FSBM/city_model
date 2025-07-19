import { useGLTF } from '@react-three/drei'


export function GloomyCity(props) {
    const model = useGLTF('/final_with_low_size_city.glb')
    console.log(model)
}