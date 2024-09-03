import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Avatar, Button, Menu } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { LOG_OUT } from "src/lib/graphql/mutations";
import {
  Viewer,
  LogOutMutation as LogOutData,
} from "src/__generated__/graphql";
import { displaySuccessNotification, displayErrorMessage } from "src/lib/utils";

import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];

interface MenuItemsProps {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export function MenuItems({ viewer, setViewer }: MenuItemsProps) {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data: LogOutData) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You've successfully logged out!");
      }
    },
    onError: () => {
      displayErrorMessage(
        "Sorry, we weren't able to to log you out. Please try again later!"
      );
    },
  });

  const items: MenuItem[] = useMemo(
    () => [
      {
        label: <NavLink to="/host">Host</NavLink>,
        key: "host",
        icon: <HomeOutlined />,
      },
      viewer.id && viewer.avatar
        ? {
            key: "avatar",
            icon: <Avatar src={viewer.avatar} />,
            children: [
              {
                label: <NavLink to={`/user/${viewer.id}`}>Profile</NavLink>,
                key: "profile",
                icon: <UserOutlined />,
              },
              {
                label: <span onClick={() => logOut()}>Log out</span>,
                key: "logout",
                icon: <LogoutOutlined />,
              },
            ],
          }
        : {
            label: (
              <NavLink to="/login">
                <Button type="primary">Sign In</Button>
              </NavLink>
            ),
            key: "signin",
          },
    ],
    [viewer, logOut]
  );

  return (
    <Menu mode="horizontal" selectable={false} className="menu" items={items} />
  );
}
