import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  //Navigation,
  staticClasses
} from "@decky/ui";
import {
  addEventListener,
  removeEventListener,
  callable,
  definePlugin,
  toaster,
  // routerHook
} from "@decky/api"
import { useState } from "react";
import { FaShip } from "react-icons/fa";

// import logo from "../assets/logo.png";

// Have not implemented the python function yet
// Concept is to use uPower to get battery health example bash command is upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep -E "state|to\ full | percentage | capacity"
// Then just pipe the output to a python script that parses the output and returns the battery health
// Problem is I don't know if upower is installed on SteamOS 3 by default

const checkBatteryHealth = callable<[], { fullCharge: number, batterySize: number }>("get_battery_info");

function Content() {
  const [result, setResult] = useState<number | undefined>();

  const onClick = async () => {
    try {
      const result = await checkBatteryHealth();
      console.log("Battery Info:", result); // Debugging log
      const batteryHealth = (result.fullCharge / result.batterySize) * 100;
      setResult(batteryHealth);
    } catch (error) {
      console.error("Error fetching battery health:", error);
    }
  };

  return (
    <PanelSection title="DeckyBatteryHealth">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={onClick}
        >
          {result !== undefined ? `Battery Health: ${result.toFixed(2)}%` : "Check Battery Health"}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin(() => {
  console.log("Template plugin initializing, this is called once on frontend startup")

  // serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
  //   exact: true,
  // });

  // Add an event listener to the "timer_event" event from the backend
  const listener = addEventListener<[
    test1: string,
    test2: boolean,
    test3: number
  ]>("timer_event", (test1, test2, test3) => {
    console.log("Template got timer_event with:", test1, test2, test3)
    toaster.toast({
      title: "template got timer_event",
      body: `${test1}, ${test2}, ${test3}`
    });
  });

  return {
    // The name shown in various decky menus
    name: "Decky Battery Health",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>Check your current battery health on your Deck!</div>,
    // The content of your plugin's menu
    content: <Content />,
    // The icon displayed in the plugin list
    icon: <FaShip />,
    // The function triggered when your plugin unloads
    onDismount() {
      console.log("Unloading")
      removeEventListener("timer_event", listener);
      // serverApi.routerHook.removeRoute("/decky-plugin-test");
    },
  };
});
