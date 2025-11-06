import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import ShowCauseNotice from "../AppModules/PGR/ShowCauseNotice";
import { QueryClient, QueryClientProvider } from "react-query";
import { localStorageMock, mockShowcauseDetails} from "../components/MockData";
import * as ReactQuery from "react-query";


const queryClient = new QueryClient();

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = () => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "DfsWeb.user-info",
    JSON.stringify({ uuid: "b4b6ace7-df04-4545-9683-cfe900834a9e" })
  );
  jest.spyOn(ReactQuery, "useQuery").mockImplementation((queryKey, queryFn) => {
    if (queryKey[0] === "Showcause_Deatils") {
      return {
        data: { ...mockShowcauseDetails },
        isLoading: false,
        refetch: jest.fn(),
      };
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Provider store={store}>
          <ShowCauseNotice />
        </Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Showcause notice Page", () => {
  test("renders Showcause notice component", () => {
    renderComponent();
  });
});
