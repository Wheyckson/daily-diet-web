import {
  BowlFood,
  Bread,
  Hamburger,
  Pizza,
} from "@phosphor-icons/react/dist/ssr";

export const EmptyListMessage = () => {
  return (
    <div className="flex flex-col items-center w-full mt-4">
      <span className="text-lg font-bold">
        Nada por aqui, tente cadastrar uma nova refeição
      </span>

      <div className="flex mt-4">
        <BowlFood size={32} weight="duotone" />
        <Hamburger size={32} weight="duotone" />
        <Pizza size={32} weight="duotone" />
        <Bread size={32} weight="duotone" />
      </div>
    </div>
  );
};
