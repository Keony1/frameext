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
var filterPane;
// /Nodes

function createFilterButton() {
  if (!filterHeader) return;
  var divButtons = filterHeader.children[0];

  // button is already there
  if (divButtons.querySelector("#ext-btn")) {
    return;
  }

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var pathCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  var pathCheck = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewbox", "0 0 24 24");
  svg.setAttribute("width", "24px");
  svg.setAttribute("height", "24px");
  svg.setAttribute("fill", "#9195ae8c");
  pathCheck.setAttribute(
    "d",
    "M4.12158 8.82129C4.4292 8.82129 4.6709 8.70264 4.83789 8.45654L8.9292 2.2207C9.04785 2.04053 9.09619 1.86914 9.09619 1.71094C9.09619 1.28467 8.771 0.968262 8.33154 0.968262C8.03271 0.968262 7.84375 1.07812 7.65918 1.36377L4.104 6.97119L2.30225 4.76074C2.13525 4.55859 1.95068 4.4707 1.6958 4.4707C1.25195 4.4707 0.931152 4.78711 0.931152 5.21777C0.931152 5.41113 0.988281 5.57812 1.15527 5.76709L3.42285 8.4917C3.61182 8.71582 3.83154 8.82129 4.12158 8.82129Z",
  );
  pathCircle.setAttribute(
    "d",
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm7.5-9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z",
  );
  pathCheck.setAttribute("fill", "#9195ae8c");
  pathCheck.style.transform = "translate(7px, 7px)";
  pathCircle.setAttribute("fill", "#9195ae8c");
  svg.appendChild(pathCheck);
  svg.appendChild(pathCircle);

  const btn = document.createElement("button");
  btn.id = "ext-btn";
  btn.classList.add("StyledToggleIconButton-vapor__sc-b90dcabf-0");
  btn.classList.add("eLftJr");

  btn.title = "Current page only";
  btn.appendChild(svg);
  btn.addEventListener("mouseover", () => {
    btn.style.backgroundColor = "#393d4f59";
    if (btn_status === "hide") return;
    pathCheck.setAttribute("fill", "#f3f3f7e6");
    pathCircle.setAttribute("fill", "#f3f3f7e6");
  });
  btn.addEventListener("mouseout", () => {
    btn.style.backgroundColor = "transparent";
    if (btn_status === "hide") return;
    pathCheck.setAttribute("fill", "#9195ae8c");
    pathCircle.setAttribute("fill", "#9195ae8c");
  });

  btn.addEventListener("click", () => {
    if (btn_status === "show") {
      btn_status = "hide";
      pathCheck.setAttribute("fill", "#5b53ff");
      pathCircle.setAttribute("fill", "#5b53ff");
      btn.style.backgroundColor = "transparent";
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
    if (mutation.type === "childList") {
      filterHeader = document.querySelector(
        ".Box-vapor__sc-21a9bb33-0 .iwIbbg",
      );
      if (filterHeader && !docReady) {
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
        commentsObs.observe(commentsContainer, {
          childList: true,
        });
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

      // filterPane = document.querySelector(
      //   ".StyledMenuList-vapor__sc-9891138c-0.eTXGYj",
      // );
      // if (filterPane) {
      //   var completedDiv = filterPane.children[0].children[3];
      //   var checkboxParent = completedDiv.querySelector(
      //     ".StyledCheckbox-vapor__sc-9e98f2e1-1.hdGxcR",
      //   );
      //   if (checkboxParent.children.length > 0) {
      //     console.log("checked");
      //   } else {
      //     console.log("cheked'nt"); // I know the grammar is wrong, but its funny.
      //   }
      //   console.log("checkbox", checkboxParent.children);
      // }
    }
  }
});
bodyObserver.observe(document.body, { childList: true, subtree: true });
