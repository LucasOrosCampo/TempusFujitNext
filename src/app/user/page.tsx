"use client";
import { useEffect, useState } from "react";
import { create_user, delete_all, get_all } from "../../../actions/query";

export default function Page() {
  let [data, setData] = useState<string>();
  let [reload, setReload] = useState<boolean>(true);
  let trigger_reload = () => setReload(!reload);
  let load = async () => {
    setData(await JSON.stringify((await get_all()) ?? {}));
  };
  useEffect(() => {
    load();
  }, [reload]);
  return (
    <div>
      <p>{data}</p>
      <button
        onClick={async () => {
          await create_user();
          trigger_reload();
        }}
      >
        CREATE
      </button>
      <button
        onClick={async () => {
          await delete_all();
          trigger_reload();
        }}
      >
        DELETE ALL ALL
      </button>
    </div>
  );
}
