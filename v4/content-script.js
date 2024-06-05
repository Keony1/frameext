var pdf_page = 1;
var btn_status = "show";
var totalPages;

// Nodes
var filterHeader;
var commentsContainer;
var prevBtn;
var nextBtn;
var commentCounterText;
var pdfPageInput;
var pdfPageContainer;
// /Nodes

function createFilterButton() {
  if (!filterHeader) return;
  var divButtons = filterHeader.children[0];

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewbox", "0 0 16 16");
  svg.setAttribute("width", "16px");
  svg.setAttribute("height", "16px");
  svg.setAttribute("fill", "#9195ae8c");
  path.setAttribute(
    "d",
    "M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm-.77 10.756l4.352-4.359a.75.75 0 0 0-1.062-1.06l-4.352 4.36a.75.75 0 1 0 1.061 1.06zm.001-1.064L5.096 7.56a.75.75 0 0 0-1.06 1.062l2.136 2.132a.75.75 0 1 0 1.06-1.062z",
  );
  svg.style.marginRight = "5px";
  svg.appendChild(path);

  const btn = document.createElement("button");
  btn.id = "ext-btn";
  btn.classList.add("eLftJr");

  btn.title = "Current page only";
  btn.appendChild(svg);
  btn.addEventListener("mouseover", () => {
    svg.setAttribute("fill", "#9195ae8c");
  });
  btn.addEventListener("mouseout", () => {
    svg.setAttribute("fill", "#B8C1CF");
  });

  btn.addEventListener("click", () => {
    if (btn_status === "show") {
      btn_status = "hide";
    } else {
      btn_status = "show";
    }
    toggleCommentsVisibility();
  });

  divButtons.prepend(btn);
}

function getCommentPage(commentDiv) {
  const pgContainer = commentDiv.querySelector(
    '[aria-label="Comment page stamp"',
  );

  if (!pgContainer) {
    // things that are not comments
    return -1;
  }
  return Number(pgContainer.innerHTML.replace(/\D/g, ""));
}

function toggleCommentReplies(comments, start, display) {
  let count = 0;
  let comment = comments[start];
  while (comment && getCommentPage(comment) === -1) {
    comment.style.display = display;

    start += 1;
    count += 1;
    comment = comments[start];
  }

  return count;
}

function toggleCommentsVisibility() {
  const commentsContainerParent = document.querySelector(
    ".Box-vapor__sc-21a9bb33-0.ScrollBox-vapor__sc-3587a982-1.bqxwQB.ZOnJu",
  );
  const commentsContainer = commentsContainerParent.children[0];
  const comments = commentsContainer.children;
  for (let i = 0; i < comments?.length; i++) {
    let comment = comments[i];
    let commentPage = getCommentPage(comment);

    if (
      commentPage !== pdf_page &&
      comment.style.display !== "none" &&
      btn_status === "hide"
    ) {
      comment.style.display = "none";
    } else if (
      commentPage !== pdf_page &&
      comment.style.display === "none" &&
      btn_status === "show"
    ) {
      comment.style.display = "block";
    } else if (
      commentPage === pdf_page &&
      comment.style.display === "none" &&
      btn_status === "hide"
    ) {
      comment.style.display = "block";
    } else if (
      commentPage !== pdf_page &&
      comment.style.display === "none" &&
      btn_status === "show"
    ) {
      comment.style.display = "block";
    } else if (
      commentPage !== pdf_page &&
      comment.style.display === "none" &&
      btn_status === "hide"
    ) {
      comment.style.display = "none";
    }

    i += toggleCommentReplies(comments, i + 1, comment.style.display);
  }

  //updateCommentCounter();
}

function updateCommentCounter() {
  const commentsContainerParent = document.querySelector(
    ".Box-vapor__sc-21a9bb33-0.ScrollBox-vapor__sc-3587a982-1.bqxwQB.ZOnJu",
  );
  const commentsContainer = commentsContainerParent.children[0];
  const comments = commentsContainer.children;

  let count = 0;
  let total = 0;
  for (const comment of comments) {
    if (getCommentPage(comment) !== -1 && comment.style.display !== "none") {
      count++;
    }

    if (getCommentPage(comment) !== -1) {
      total++;
    }
  }
  var cmt = "Comments";
  if (btn_status === "hide") {
    if (total === 1) {
      cmt = "Comment";
    }
    commentCounterText.innerHTML = `<span>${count} of ${total} ${cmt}</span>`;
  } else {
    if (count === 1) {
      cmt = "Comment";
    }
    commentCounterText.innerHTML = `<span>${count} ${cmt}</span>`;
  }
}

function eventClickToGetPage(comment) {
  const pg = getCommentPage(comment);
  pdf_page = pg;
}

var docReady = false;
var bodyObserver = new MutationObserver((mutations, observer) => {
  for (let mutation of mutations) {
    if (mutation.type === "childList" && !docReady) {
      filterHeader = document.querySelector(
        ".Box-vapor__sc-21a9bb33-0 .iwIbbg",
      );
      if (filterHeader) {
        docReady = true;
        createFilterButton();
      }

      commentsContainer = document.querySelector(
        ".Box-vapor__sc-21a9bb33-0.ScrollBox-vapor__sc-3587a982-1.bqxwQB.ZOnJu",
      );

      totalPages = document.querySelector(
        ".StyledText-vapor__sc-a9d66504-0.fXwLkI",
      );
      if (totalPages) {
        totalPages = Number(totalPages.innerHTML.replace("/", ""));
      }

      if (commentsContainer) {
        //docReady = true;
        commentsContainer = commentsContainer.children[0];
        const commentsObs = new MutationObserver((mutationList, _) => {
          for (let mutation of mutationList) {
            if (mutation.type === "childList") {
              for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                  node.addEventListener("click", (_) => {
                    eventClickToGetPage(node);
                  });
                }
                toggleCommentsVisibility();
              }
            }
          }
        });
        commentsObs.observe(commentsContainer, { childList: true });
      }

      prevBtn = document.querySelector('[data-testid="previous-page"]');
      nextBtn = document.querySelector('[data-testid="next-page"]');
      if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
          if (pdf_page == 1) return;
          pdf_page = pdf_page - 1;
          toggleCommentsVisibility();
        });
        nextBtn.addEventListener("click", () => {
          if (pdf_page === totalPages) return;
          pdf_page = pdf_page + 1;
          toggleCommentsVisibility();
        });
      }

      pdfPageInput = document.querySelector(
        ".StyledInput-vapor__sc-d70028cb-0.kwQtRu",
      );

      if (pdfPageInput) {
      }

      pdfPageContainer = document.querySelector(".sc-ef6e0dc-0.eMWYMH");
      if (pdfPageContainer) {
        var pdfPageObs = new MutationObserver((mutationList, _) => {
          for (let mutation of mutationList) {
            if (mutation.type === "attributes") {
              // selected thumbnail
              if (mutation.target.className === "sc-fd60a1e3-1 fajzqY") {
                const pgContainer = mutation.target.querySelectorAll(
                  ".StyledText-vapor__sc-a9d66504-0.btJdwr",
                );
                const pg = pgContainer[pgContainer.length - 1];
                pdf_page = Number(pg.innerHTML);
                toggleCommentsVisibility();
              }
            }
          }
        });
        pdfPageObs.observe(pdfPageContainer, {
          attributes: true,
          subtree: true,
        });
      }

      commentCounterText = document.querySelector(
        ".Box-vapor__sc-21a9bb33-0.iFpWCv",
      );
    }
  }
});
bodyObserver.observe(document.body, { childList: true });
