import { Tabs } from "expo-router";
import { iconesLib } from "@/assets/icons/iconesLib";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { cores } from "@/constants/cores";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <>
      <StatusBar translucent />
      <Tabs
        screenOptions={{
          tabBarInactiveBackgroundColor: cores.fundo,
          tabBarActiveBackgroundColor: cores.primaria,
          tabBarLabelStyle: [estilo.texto, { fontWeight: "600" }],
          tabBarItemStyle: { borderTopWidth: 1, borderColor: cores.secundaria },
          tabBarStyle: { height: 55 },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) =>
              focused ? iconesLib.homeAtivo : iconesLib.home,
          }}
        />
        <Tabs.Screen
          name="pesquisa"
          options={{
            title: "Pesquisar",
            tabBarIcon: ({ focused }) =>
              focused ? iconesLib.lupaAtiva : iconesLib.lupa2,
          }}
        />
        <Tabs.Screen
          name="mapa"
          options={{
            title: "Mapa",
            tabBarIcon: ({ focused }) =>
              focused ? iconesLib.mapaAtivo : iconesLib.mapa,
          }}
        />
        <Tabs.Screen
          name="[user]"
          options={{
            title: "Perfil",
            tabBarIcon: ({ focused }) =>
              focused ? iconesLib.userAtivo : iconesLib.user,
            href: {
              pathname: "/[user]",
              params: {
                user: "fulano exemplar",
              },
            },
          }}
        />
      </Tabs>
    </>
  );
}

const estilo = {
  texto: ConstrutorEstiloConstante.construtor()
    .fonteM()
    .corSecundaria()
    .construir(),
};
