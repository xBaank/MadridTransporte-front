import LinkReplace from "../LinkReplace";

export default function Info() {
  return (
    <div
      className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
      <div className={`px-6 py-4`}>
        <div className="font-bold text-xl mb-2">- Sobre este proyecto</div>
        <p className=" text-third text-base">
          Este proyecto no esta afiliado a ninguna empresa de transporte
          publico, ni a ninguna empresa de desarrollo de software.
        </p>
        <br />
        <div className="font-bold text-xl mb-2">- Extraccion de datos</div>
        <p>
          Todos los datos se extraen de Metro de Madrid, EMT Madrid y Consorcio
          Regional de Transportes de Madrid.
        </p>
        <br />
        <div className="font-bold text-xl mb-2">- Problemas</div>
        <p>
          Si encuentras algun problema, puedes reportarlo{" "}
          <LinkReplace
            className="border-b"
            to={"https://github.com/xBaank/MadridTransporte/issues/new/choose"}>
            Aqui
          </LinkReplace>
        </p>
        <br />
        <div className="font-bold text-xl mb-2">- Codigo Fuente</div>
        <p>
          El codigo fuente puedes encontrarlo{" "}
          <LinkReplace
            className="border-b"
            to={"https://github.com/xBaank/MadridTransporte"}>
            Aqui
          </LinkReplace>
        </p>
        <br />
        <div className="font-bold text-xl mb-2">- Icons</div>
        <a
          href="https://www.flaticon.com/free-icons/bus-stop"
          title="bus stop icons">
          Bus stop icons created by mavadee - Flaticon
        </a>
      </div>
    </div>
  );
}
