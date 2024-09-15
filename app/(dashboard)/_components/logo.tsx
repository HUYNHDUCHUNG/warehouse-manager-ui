import Image from "next/image"

export const Logo = () =>{
    return (
        <div className="flex items-center gap-1">
            <Image
                height={70}
                width={40}
                alt="Logo"
                src={'/logo.svg'}
            />
            <span className="text-xl text-white font-bold">

                Warehouse
            </span>
        </div>
    )
}