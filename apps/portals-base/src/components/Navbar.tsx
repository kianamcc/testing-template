import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  AppUtils,
  IconSvg,
  SynapseComponents,
  SynapseQueries,
  SystemUseNotification,
  useSynapseContext,
} from "synapse-react-client";
import NavLink from "../components/NavLink";
import NavUserLink from "../components/NavUserLink";
import { ConfigRoute, GenericRoute } from "../types/portal-config";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  SxProps,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { RESPONSIVE_SIDE_PADDING } from "../utils";
import { usePortalContext } from "./PortalContext";
import { SynapseConstants } from "synapse-react-client";
import { useCookies } from "react-cookie";
import { useLogInDialogContext } from "./LogInDialogContext";

type SynapseSettingLink = {
  text: string;
  hasBorder?: boolean;
  settingSubPath?: string;
};

const synapseQuickLinks: SynapseSettingLink[] = [
  {
    text: "Profile",
  },
  {
    text: "Projects",
    settingSubPath: "projects",
  },
  {
    text: "Teams",
    settingSubPath: "teams",
  },
  {
    text: "Challenges",
    settingSubPath: "challenges",
  },
];

function Navbar() {
  const { routeConfig, logoHeaderConfig } = usePortalContext();
  const { accessToken } = useSynapseContext();
  let isSignedIn = !!accessToken;
  const history = useHistory();
  const { data: userProfile } = SynapseQueries.useGetCurrentUserProfile();
  const [showMenu, setShowMenu] = useState(false);
  const openBtnRef = React.useRef<HTMLDivElement>(null);

  const { refreshSession, clearSession, twoFactorAuthSSOErrorResponse } =
    AppUtils.useApplicationSessionContext();

  const [cookies, setCookie] = useCookies([
    SynapseConstants.ACCESS_TOKEN_COOKIE_KEY,
  ]);

  const buttonSx: SxProps = {
    color: "grey.800",
    mb: "10px",
  };

  const redirectToSynapseLogin = () => {
    const redirect_uri = encodeURIComponent(document.location.origin);
    const scope = encodeURIComponent("openid email view download");

    const test = `https://signin.synapse.org/?response_type=code&client_id=${
      import.meta.env.VITE_PORTAL_CLIENT
    }&scope=${scope}&redirect_uri=${redirect_uri}`;

    window.location = test as unknown as Location;
  };

  const handleOAuth = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");
    const redirect_uri = window.location.origin;

    const url = "https://repo-prod.prod.sagebase.org/auth/v1/oauth2/token";

    if (authorizationCode) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              btoa(
                `${import.meta.env.VITE_PORTAL_CLIENT}:${
                  import.meta.env.VITE_PORTAL_SECRET
                }`
              ),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            redirect_uri: redirect_uri,
            code: authorizationCode,
          }),
        });

        const data = await response.json();
        const accessToken = data.access_token;

        setCookie(SynapseConstants.ACCESS_TOKEN_COOKIE_KEY, accessToken);

        refreshSession();
        history.replace(location.pathname);
      } catch (error) {
        console.error("Error exchanging authorization code for tokens:", error);
      }
    }
  };

  const { showLoginDialog, setShowLoginDialog } = useLogInDialogContext();

  if (twoFactorAuthSSOErrorResponse) {
    setShowLoginDialog(true);
  }

  useEffect(() => {
    handleOAuth();

    function handleClickOutside(e: Event) {
      const node = e.target as HTMLElement;
      if (
        openBtnRef &&
        !(openBtnRef.current === node || node?.closest(".dropdown-toggle"))
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // given the hash, decide if the link should have a bottom border
  const getBorder = (name: string = "") => {
    if (name === "") {
      // special case the home page
      return;
    }
    const hash = window.location.hash.substring(2);
    return hash.includes(name) ? "bottom-border" : "";
  };

  const goToTop = () => {
    window.scroll({ top: 0 });
  };

  const getLinkHref = (
    route: GenericRoute,
    topLevelTo?: string,
    includeQueryParams?: boolean
  ) => {
    const { path, link } = route;
    let href = link ?? `/${topLevelTo}/${path}`;
    const indexOfQuestionMark = href.indexOf("?");
    if (!includeQueryParams && indexOfQuestionMark > -1) {
      href = href.slice(0, indexOfQuestionMark);
    }
    return href;
  };

  // , hideLogin = false
  const { name, icon } = logoHeaderConfig;
  const imageElement = icon ? (
    <img
      id="header-logo-image"
      alt="navigation logo"
      className="nav-logo"
      src={icon}
    />
  ) : (
    <></>
  );
  const nameElement = name ? (
    <span style={{ marginLeft: 10 }}>{name}</span>
  ) : (
    <></>
  );

  const isHomeSelectedCssClassName =
    window.location.pathname.replace("/", "") === "" ? "isSelected" : "";
  const homeRouteConfig: ConfigRoute | undefined = routeConfig.filter(
    (r: GenericRoute): r is ConfigRoute => {
      return !!(
        r.path === "" &&
        r.synapseConfigArray &&
        r.synapseConfigArray.length > 0
      );
    }
  )[0];

  // if the home route does not contain any titles, then just show a link
  const homeConfigTitleCount = homeRouteConfig?.synapseConfigArray?.filter(
    (config) => config.title !== undefined
  ).length;
  const isHomeDropdown = homeConfigTitleCount
    ? homeConfigTitleCount > 0
    : false;

  return (
    <React.Fragment>
      <Box
        component={"nav"}
        className={
          !showMenu
            ? "flex-display nav top-nav"
            : "flex-display nav top-nav mb-active"
        }
        sx={RESPONSIVE_SIDE_PADDING}
      >
        <div className="nav-logo-container">
          <NavLink
            onClick={goToTop}
            style={{ display: "flex", alignItems: "center" }}
            to="/"
            id="home-link"
            text={
              <>
                {imageElement} {nameElement}
              </>
            }
          />
        </div>
        <div
          className="nav-mobile-menu-btn mb-open"
          onClick={() => {
            setShowMenu(true);
          }}
          ref={openBtnRef}
        >
          MENU
        </div>
        <div
          className="nav-mobile-menu-btn mb-close"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          <span>&#10005;</span>
        </div>
        <div className="nav-link-container">
          {isSignedIn && (
            // mobile sign out
            <div className="center-content nav-button nav-button-signin mobile-signout-container">
              <Button
                id="signin-button"
                color="secondary"
                variant="contained"
                className="signout-button-mb"
                onClick={() => {
                  clearSession();
                }}
              >
                Sign Out
              </Button>
            </div>
          )}
          {!isSignedIn && (
            // desktop sign in
            <div className="center-content nav-button-signin">
              <Button
                id="signin-button"
                color="secondary"
                variant="contained"
                onClick={() => {
                  setShowLoginDialog(true);
                }}
              >
                Sign&nbsp;In
              </Button>
              <Dialog
                onClose={() => {
                  setShowLoginDialog(false);
                }}
                open={showLoginDialog}
              >
                <IconButton
                  aria-label={"Close"}
                  onClick={() => {
                    setShowLoginDialog(false);
                  }}
                  sx={{ marginLeft: "auto" }}
                >
                  <IconSvg
                    icon={"close"}
                    wrap={false}
                    sx={{ color: "grey.700" }}
                  />
                </IconButton>
                <DialogContent dividers={false}>
                  <Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ ...buttonSx, height: "50px" }}
                      onClick={redirectToSynapseLogin}
                    >
                      Sign In With Synapse
                    </Button>
                  </Box>
                  <SystemUseNotification maxWidth={"325px"} />
                </DialogContent>
              </Dialog>
            </div>
          )}

          {isSignedIn && userProfile && (
            // desktop version, show dropdown
            <>
              <Dropdown className="user-loggedIn">
                <Dropdown.Toggle
                  variant="light"
                  id="user-menu-button"
                  aria-label="User Dropdown Menu"
                >
                  <NavUserLink userProfile={userProfile} />
                </Dropdown.Toggle>
                <Dropdown.Menu className="nav-user-menu portal-nav-menu">
                  <Dropdown.Item className="SRC-primary-background-color-hover SRC-nested-color border-bottom-1">
                    Signed in as&nbsp;
                    <strong>{userProfile.userName}</strong>
                  </Dropdown.Item>
                  {synapseQuickLinks.map((el) => {
                    const borderBottomClass = el.hasBorder
                      ? "border-bottom-1"
                      : "";
                    return (
                      <Dropdown.Item
                        key={el.text}
                        className={`SRC-primary-background-color-hover SRC-nested-color ${borderBottomClass}`}
                        href={`https://www.synapse.org/Profile:${
                          userProfile.ownerId
                        }${el.settingSubPath ? `/${el.settingSubPath}` : ""}`}
                      >
                        {el.text}
                      </Dropdown.Item>
                    );
                  })}
                  <Dropdown.Item
                    key="DownloadV2"
                    onClick={() => {
                      // In React Router ^6.6.1, change to useNavigate
                      history.push("/DownloadCart");
                    }}
                    className="SRC-primary-background-color-hover SRC-nested-color border-bottom-1"
                  >
                    Downloads
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="Settings"
                    className="SRC-primary-background-color-hover SRC-nested-color border-bottom-1"
                    href={`https://www.synapse.org/Profile:${userProfile.ownerId}/settings`}
                  >
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Item // desktop sign out
                    className="SRC-primary-background-color-hover SRC-nested-color"
                    onClick={() => {
                      clearSession();
                    }}
                  >
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <a
                className="user-loggedIn-mb" // mobile version, shows the user icon and name, no dropdown
                href={`https://www.synapse.org/Profile:${userProfile.ownerId}/projects/all`}
              >
                <NavUserLink userProfile={userProfile} />
              </a>
            </>
          )}
          {isSignedIn && (
            <SynapseComponents.ShowDownloadV2
              className="nav-button nav-button-container center-content"
              to="/DownloadCart"
            />
          )}
          {
            // we have to loop backwards due to css rendering of flex-direction: row-reverse
            routeConfig
              .slice()
              .reverse()
              .filter((el) => !["", "/"].includes(el.path!))
              .map((el: GenericRoute, topLevelIndex) => {
                const topLevelTo = el.path;
                const displayName = el.displayName
                  ? el.displayName
                  : topLevelTo;
                const icon = el.icon && (
                  <img style={{ padding: "0px 4px" }} src={el.icon} />
                );
                if (el.hideRouteFromNavbar) {
                  return false;
                }
                // hide children and only show top level element if all nested routes are hidden
                const hideChildren =
                  el.exact ||
                  (el.routes &&
                    el.routes.every((route) => route.hideRouteFromNavbar));
                if (!el.exact && !hideChildren) {
                  const isSelected =
                    el.routes &&
                    el.routes.some((route) =>
                      decodeURIComponent(window.location.pathname).includes(
                        getLinkHref(route, topLevelTo, false)
                      )
                    );
                  const isSelectedCssClassName = isSelected ? "isSelected" : "";
                  return (
                    <React.Fragment key={`${topLevelTo}-${topLevelIndex}`}>
                      {el.routes &&
                        el.routes.map((route, index) => {
                          const { path: to, link, target } = route;
                          // Add anchors to the DOM for a crawler to find.  This is an attempt to fix an issue where all routes are Excluded from the index.
                          if (route.hideRouteFromNavbar) {
                            return false;
                          }
                          const routeDisplayName = route.displayName ?? to;
                          const linkDisplay = link ?? `/${topLevelTo}/${to}`;
                          return (
                            <a
                              key={`${to}-seo-anchor-${index}`}
                              className="crawler-link"
                              href={linkDisplay}
                              target={target ?? "_self"}
                            >
                              {routeDisplayName}
                            </a>
                          );
                        })}
                      <Dropdown className={getBorder(topLevelTo)}>
                        <Dropdown.Toggle
                          variant="light"
                          id={`Navbar-dropdown-${displayName}`}
                          className={`nav-button-container nav-button ${isSelectedCssClassName}`}
                        >
                          {displayName}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="portal-nav-menu">
                          {el.routes &&
                            el.routes.map((route, index) => {
                              const { path: to, target } = route;
                              if (route.hideRouteFromNavbar) {
                                return false;
                              }
                              const routeDisplayName = route.displayName ?? to!;
                              const linkDisplay = getLinkHref(
                                route,
                                topLevelTo,
                                true
                              );
                              return (
                                <Dropdown.Item key={`${to}-${index}`} as="li">
                                  <NavLink
                                    className="dropdown-item SRC-primary-background-color-hover SRC-nested-color"
                                    to={linkDisplay}
                                    text={routeDisplayName}
                                    target={target ?? "_self"}
                                  />
                                </Dropdown.Item>
                              );
                            })}
                        </Dropdown.Menu>
                      </Dropdown>
                    </React.Fragment>
                  );
                }
                const linkOrTo = el.link ?? `/${topLevelTo}`;
                const isSelectedCssClassName =
                  decodeURIComponent(window.location.pathname) === linkOrTo
                    ? "isSelected"
                    : "";
                return (
                  <NavLink
                    key={`${topLevelTo}-${topLevelIndex}`}
                    className={`nav-button nav-button-container center-content ${isSelectedCssClassName} ${getBorder(
                      topLevelTo
                    )}`}
                    to={linkOrTo}
                    target={el.target}
                    text={
                      <>
                        {icon} {displayName}
                      </>
                    }
                  />
                );
              })
          }
          {
            // if theres less than 7 navbar items show the home page button
            routeConfig.filter((el) => !el.hideRouteFromNavbar).length < 7 &&
              (isHomeDropdown ? (
                <Dropdown className={getBorder("")}>
                  <Dropdown.Toggle
                    variant="light"
                    id={"Navbar-dropdown-Home"}
                    className={`nav-button-container nav-button ${isHomeSelectedCssClassName}`}
                  >
                    Home
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="portal-nav-menu">
                    {homeRouteConfig &&
                      homeRouteConfig.synapseConfigArray?.map(
                        (config, index) => {
                          const { title } = config;
                          if (!title) return <React.Fragment key={index} />;

                          return (
                            <Dropdown.Item key={title} as="li">
                              <NavLink
                                className="dropdown-item SRC-primary-background-color-hover SRC-nested-color"
                                text={title}
                                to={`/#${encodeURI(title)}`}
                              />
                            </Dropdown.Item>
                          );
                        }
                      )}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <NavLink
                  className={`nav-button nav-button-container center-content ${isHomeSelectedCssClassName}`}
                  to={"/"}
                  text="Home"
                />
              ))
          }
        </div>
      </Box>
      <div className="spacer" />
    </React.Fragment>
  );
}

export default Navbar;
