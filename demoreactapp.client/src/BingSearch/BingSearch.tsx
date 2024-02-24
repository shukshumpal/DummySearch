import axios from "axios";
import React from "react";
import {
  BASE_API_URL,
  PAGE_MAX_RESPONSECOUNT,
} from "../Services/CommonRequestParams";
import { searchResponse } from "./searchResultModel";
import LoadingOverlay from "react-loading-overlay";

export interface searchProps {}
export const BingSearch: React.FC<searchProps> = ({}) => {
  let [pageNumber, setPageNum] = React.useState<number>(0);
  let [searchStr, setSearchStr] = React.useState<string>("");
  let [searchCount, setSearchCount] = React.useState<number>(0);
  let [searchList, setSearchList] = React.useState<searchResponse[]>([]);
  let [isSubmitting, setSubmitting] = React.useState<boolean>(false);

  const searchWeb = (
    searchTxt: string,
    pageNum: number,
    isPaginationCall: boolean = true
  ) => {
    let searchAPIUrl: string =
      BASE_API_URL +
      `bingsearch/searchResults?strSearch=${searchTxt}&pageNum=${pageNum}`;

    console.log(searchTxt);
    setSubmitting(true);
    axios
      .get(searchAPIUrl)
      .then(function (response) {
        let data = JSON.parse(response.data.strJSON);

        if (!isPaginationCall) {
          setSearchCount(data.webPages.totalEstimatedMatches);
        }
        setPageNum(pageNum + 1);
        setSearchList(data.webPages.value);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleTextFieldOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStr(e.target.value);
  };

  const makePaginationSearch = (targetPageNum: number) => {
    setPageNum(targetPageNum);
    searchWeb(searchStr, targetPageNum);
  };

  const handlePaginationClickEvent = (
    e: React.MouseEvent<HTMLAnchorElement>,

    targetPageNum: number
  ) => {
    if (targetPageNum == pageNumber - 1) {
      e.preventDefault();
    } else {
      makePaginationSearch(targetPageNum);
    }
  };

  // const isInvalidSearch = (): boolean => {
  //   return searchStr == undefined || searchStr == "";
  // };

  const getPaginationControl = (totalItems: number) => {
    if (totalItems == 0) {
      return <></>;
    }

    let totalPages = totalItems / PAGE_MAX_RESPONSECOUNT;
    let remainingResponse = totalItems % PAGE_MAX_RESPONSECOUNT;
    if (remainingResponse > 0) {
      totalPages += 1;
    }

    return (
      <nav aria-label="...">
        <ul className="pagination">
          <li className={"page-item" + (pageNumber == 1 ? " disabled" : "")}>
            <a
              className="page-link"
              onClick={(e) =>
                pageNumber == 1
                  ? e.preventDefault
                  : makePaginationSearch(pageNumber - 2)
              }
            >
              Previous
            </a>
          </li>
          <li className={"page-item" + (pageNumber == 1 ? " active" : "")}>
            <a
              className="page-link"
              onClick={(e) => handlePaginationClickEvent(e, 0)}
            >
              1
            </a>
          </li>
          {totalPages > 1 && (
            <li className={"page-item" + (pageNumber == 2 ? " active" : "")}>
              <a
                className="page-link"
                onClick={(e) => handlePaginationClickEvent(e, 1)}
              >
                2 <span className="sr-only">(current)</span>
              </a>
            </li>
          )}
          {totalPages > 2 && (
            <li className={"page-item" + (pageNumber == 3 ? " active" : "")}>
              <a
                className="page-link"
                onClick={(e) => handlePaginationClickEvent(e, 2)}
              >
                3
              </a>
            </li>
          )}
          {totalPages > 3 && (
            <li className="page-item active">
              <a
                className="page-link"
                onClick={(e) =>
                  pageNumber == totalPages
                    ? e.preventDefault
                    : handlePaginationClickEvent(e, pageNumber)
                }
              >
                Next
              </a>
            </li>
          )}
        </ul>
      </nav>
    );
  };
  const getSearchList = (dataList: searchResponse[]) => {
    return (
      <div>
        <ul>
          {dataList.map((r) => (
            <li>
              <a href={r.url} target="_blank">
                {r.name}
              </a>
              <br></br>
              <div>{r.snippet}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <LoadingOverlay
        active={isSubmitting}
        spinner
        text="Loading your content..."
      >
        <div className="searchbar">
          <div className="col-md-4"></div>
          <div className="input-group mb-3 col-md-4">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search Here"
              value={searchStr}
              onChange={handleTextFieldOnChange}
            ></input>
            <button
              type="submit"
              className={
                isSubmitting || searchStr == undefined || searchStr == ""
                  ? "input-group-text"
                  : "input-group-text btn-success"
              }
              disabled={
                isSubmitting || searchStr == undefined || searchStr == ""
              }
              onClick={() => searchWeb(searchStr, pageNumber, false)}
            >
              <i className="bi bi-search me-2"></i> Search
            </button>
          </div>
          <div className="col-md-4"></div>
        </div>

        <br></br>
        <div className="outerPadding">
          {searchCount > 0 &&
            searchList.length > 0 &&
            getSearchList(searchList)}
        </div>
        <div className="outerPadding">
          {searchCount > 0 &&
            searchList.length > 0 &&
            getPaginationControl(searchCount)}
        </div>
      </LoadingOverlay>
    </>
  );
};
