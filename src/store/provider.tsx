"use client";
import React, { createContext, ReactNode } from "react";
import Store, { RootStore } from "@/store/store";
import { observer } from "mobx-react-lite";
import { IWebApp } from "@/types";
import Script from "next/script";

export const StoreContext = createContext(RootStore);

interface State { store: Store, }

export const store = new Store();

export const Context = createContext<State>({ store, })

const StoreWrapper = observer(({ children }: { children: ReactNode }) => {
  const [webApp, setWebApp] = React.useState<IWebApp | null>(null);
  let tg_user_id: number

  // React.useEffect(() => {
  //   const app = (window as any).Telegram?.WebApp;
  //   console.log(app);

  //   if (app) {
  //     app.ready();
  //     setWebApp(app);
  //     tg_user_id = app.initDataUnsafe.user.id
  //   }
  // }, []);

  const user = {
    // tg_id: webApp ? webApp.initDataUnsafe.user.id : 0,
    // tg_id: 122445,
    tg_id: 6824597012,
    // role: (webApp && (webApp.initDataUnsafe.user.id == 1075329442 || webApp.initDataUnsafe.user.id == 915131260 || webApp.initDataUnsafe.user.id == 6824597012)) ? "OWNER" : "USER",
    // firstname: webApp ? webApp.initDataUnsafe.user.username : ""
  }

  if (user.tg_id != 0) {
    store.checkAuth(user.tg_id, user)
  }
  return (
    <Context.Provider value={{ store }}>
      {children}
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
    </Context.Provider>
  )
})



export default StoreWrapper;