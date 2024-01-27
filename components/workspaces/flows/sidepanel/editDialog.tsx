import DashedBorders from "@/components/DashedBorders";
import Icon from "@/components/Icon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ReactNode } from "react";

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    children: ReactNode,
    icon: string,
    color: string
}

export default function EditDialog({ open, setOpen, children, icon, color }: Props) {

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent
                style={{
                    maxWidth: 400,
                    backgroundColor: "rgba(7, 7, 7, .9)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "10px"
                }}
            >
                
                <div className="w-full h-36 mt-4 flex items-center justify-center relative">
                    <div className="flex w-24 h-24 relative items-center justify-center flex-col">
                        <DashedBorders />
                        <Icon id={icon} size="30px" />
                        <div style={{ boxShadow: `0px 0px 150px 20px ${color}` }}></div>
                    </div>
                </div>

                {children}

            </DialogContent>
        </Dialog>
    )

}