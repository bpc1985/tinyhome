import { Layout } from "antd";

const { Header } = Layout;
const logo = new URL("./assets/tinyhouse-logo.png", import.meta.url).href;

export const AppHeaderSkeleton = () => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <img src={logo} alt="App logo" />
        </div>
      </div>
    </Header>
  );
};
