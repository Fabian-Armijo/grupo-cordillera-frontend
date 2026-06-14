export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest"
    },
    moduleNameMapper: {

        "import\\.meta\\.env": "<rootDir>/__mocks__/importMeta.js",
        "\\.(css|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
        "^.*services/inventoryService$": "<rootDir>/__mocks__/inventoryService.js",
        "^.*services/kpiService$": "<rootDir>/__mocks__/kpiService.js",
        "^.*services/ventaService$": "<rootDir>/__mocks__/ventaService.js"

    },
    testMatch: ["<rootDir>/src/__tests__/**/*.test.[jt]s?(x)"]
};