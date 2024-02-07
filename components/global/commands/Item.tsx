import Icon from "@/components/Icon";
import { CommandItem, CommandShortcut } from "@/components/ui/command";

type ItemProps = {
  icon: string;
  title: string;
  shortcut?: string;
  action?: Function;
};

export default function Item({ icon, title, shortcut, action }: ItemProps) {
  return (
    <CommandItem onSelect={action ? () => action() : () => {}}>
      <div className="flex items-center">
        <div className="flex w-6 h-6 text-foreground/80 items-center justify-center mr-3">
          <Icon id={icon} />
        </div>
        <span className="text-foreground/80">{title}</span>
      </div>
      {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
    </CommandItem>
  );
}
