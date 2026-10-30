const toast=document.getElementById('toast');
const saveStatus=document.getElementById('saveStatus');
const STORAGE_KEY='shihbells-portfolio-customizations-v1';

let toastTimer;

document.getElementById('year').textContent=new Date().getFullYear();

function showToast(message){toast.textContent=message;toast.classList.add('show');
	clearTimeout(toastTimer);
	toastTimer=setTimeout(()=>toast.classList.remove('show'),3200)
}

function setSaveStatus(message)
{if(saveStatus)saveStatus.textContent=message}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("repoGrid");
  if (!grid) return;

  grid.replaceChildren();
  const status = document.createElement("p");
  status.className = "repo-footnote";
  status.textContent = "Loading GitHub repositories...";
  grid.append(status);

  try {
    const response = await fetch(
      "https://api.github.com/users/Shihbells/repos?sort=updated&per_page=6",
      {
        headers: {
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repositories = (await response.json())
      .filter(repo => !repo.fork)
      .slice(0, 6);

    grid.replaceChildren();

    if (repositories.length === 0) {
      grid.textContent = "No public repositories found yet.";
      return;
    }

    repositories.forEach(repo => {
      const card = document.createElement("article");
      card.className = "repo";

      const top = document.createElement("div");
      top.className = "repo-top";

      const title = document.createElement("h4");
      title.textContent = repo.name;

      const link = document.createElement("a");
      link.className = "repo-label";
      link.textContent = "View on GitHub ↗";
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      top.append(title, link);

      const description = document.createElement("p");
      description.textContent =
        repo.description || "No description provided.";

      const meta = document.createElement("div");
      meta.className = "repo-meta";

      const language = document.createElement("span");
      language.textContent = repo.language || "Language not specified";

      const updated = document.createElement("span");
      updated.textContent =
        "Updated " +
        new Date(repo.updated_at).toLocaleDateString();

      const stars = document.createElement("span");
      stars.textContent = `★ ${repo.stargazers_count}`;

      meta.append(language, updated, stars);
      card.append(top, description, meta);
      grid.append(card);
    });
  } catch (error) {
    grid.replaceChildren();

    const message = document.createElement("p");
    message.className = "repo-footnote";
    message.textContent =
      "Unable to load repositories. Visit github.com/Shihbells directly.";

    grid.append(message);
    console.error("GitHub repository loading failed:", error);
  }
});

