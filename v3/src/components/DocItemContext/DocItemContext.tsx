import React, { createContext, useCallback, useContext, useMemo } from "react";
import { DocsItemStateType, useDocsItemStore } from "./DocItemStore";

type DocItemContextType = DocsItemStateType & {
  onChangeFrontendType: (type: DocsItemStateType["frontend"]["type"]) => void;
  onChangeFrontendFramework: (
    type: DocsItemStateType["frontend"]["framework"],
  ) => void;
  onChangeUIType: (type: DocsItemStateType["uiType"]) => void;
  onChangeRecipeSettings: (
    recipeName: keyof DocsItemStateType["authenticationRecipes"],
    propertyName: string,
    propertyValue: unknown,
  ) => void;
  onChangeFrontendSettings: (
    settings: DocsItemStateType["frontend"]["settings"],
  ) => void;
  onChangeAppInfoField: (fieldName: string, value: string) => void;
  derived: {
    frontendRecipeInitCode: string;
  };
};

export const DocItemContext = createContext<DocItemContextType>(
  {} as DocItemContextType,
);

export function DocItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useDocsItemStore();

  const onChangeFrontendType = useCallback(
    (type: DocsItemStateType["frontend"]["type"]) => {
      setState({
        ...state,
        frontend: {
          ...state.frontend,
          type,
        },
      });
    },
    [state],
  );

  const onChangeFrontendFramework = useCallback(
    (type: DocsItemStateType["frontend"]["framework"]) => {
      setState({
        ...state,
        frontend: {
          type: type === "mobile" ? "mobile" : "web",
          framework: type,
          settings: {},
        },
      });
    },
    [state],
  );

  const onChangeUIType = useCallback(
    (type: DocsItemStateType["uiType"]) => {
      setState({
        ...state,
        uiType: type,
      });
    },
    [state],
  );

  const onChangeAppInfoField = useCallback(
    (fieldName: string, value: string) => {
      setState({
        ...state,
        appInfo: {
          ...state.appInfo,
          [fieldName]: value,
        },
      });
    },
    [state],
  );

  const onChangeFrontendSettings = useCallback(
    (settings: DocsItemStateType["frontend"]["settings"]) => {
      setState({
        ...state,
        frontend: {
          ...state.frontend,
          settings,
        },
      });
    },
    [state],
  );

  const derived = useMemo(() => {
    const frontendRecipeInitCode = [];
    const { authenticationRecipes } = state;
    if (authenticationRecipes.emailpassword.enabled) {
      frontendRecipeInitCode.push(`EmailPassword.init(),`);
    }
    if (authenticationRecipes.thirdparty.enabled) {
      frontendRecipeInitCode.push(`ThirdParty.init(),`);
    }
    if (authenticationRecipes.passwordless.enabled) {
      frontendRecipeInitCode.push(`Passwordless.init(),`);
    }

    return {
      frontendRecipeInitCode: frontendRecipeInitCode.join("\n"),
    };
  }, [state]);

  const onChangeRecipeSettings = useCallback(
    (
      recipeName: keyof DocsItemStateType["authenticationRecipes"],
      propertyName: string,
      propertyValue: unknown,
    ) => {
      setState({
        ...state,
        authenticationRecipes: {
          ...state.authenticationRecipes,
          [recipeName]: {
            ...state.authenticationRecipes[recipeName],
            settings: {
              ...state.authenticationRecipes[recipeName].settings,
              [propertyName]: propertyValue,
            },
          },
        },
      });
    },
    [state],
  );

  return (
    <DocItemContext.Provider
      value={{
        ...state,
        onChangeFrontendType,
        onChangeUIType,
        onChangeRecipeSettings,
        onChangeAppInfoField,
        onChangeFrontendFramework,
        onChangeFrontendSettings,
        derived,
      }}
    >
      {children}
    </DocItemContext.Provider>
  );
}
