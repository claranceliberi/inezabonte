import Image from "next/image";
import Layout from "../components/Layout";
import { getGitHubStars, getGitHubContributions } from "../lib/github";
import { getAllFilesFrontMatter } from "../lib/articles";
import { convertDate } from "../components/date";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import Header from "../components/Header";
import profilePic from "../public/Images/me.jpg";
import generateRssFeed from "../lib/rss";

export default function index({ starredRepos, contributions, articles }) {
	return (
		<Layout>
			<Header title="Ineza Bonté" />
			<main className="space-y-12 px-6 py-10 flex flex-col self-center">
				<section className="flex flex-col justify-center items-center lg:flex-row  lg:justify-around ">
					<div className="mb-10 border-8 border-gray-400 dark:border-gray-200 rounded-full flex items-center">
						<Image
							priority={true}
							src={profilePic}
							height={200}
							width={200}
							alt="A potrait of Ineza Bonté smiling"
							className="rounded-full"
						/>
					</div>
					<div className="md:self-center max-w-lg space-y-4 prose dark:prose-dark prose-lg md:prose-xl">
						<h2>I'm Ineza Bonté,</h2>
						<p>
							A Fullstack Developer based in Kigali, Rwanda
							<br />I have a passion for coding and developing Web Applications.
						</p>
						<p>
							You can reach me by email at:{" "}
							<a href="mailto:inezabonte@gmail.com" className="underline">
								inezabonte@gmail.com
							</a>
						</p>
					</div>
				</section>
				<section className="space-y-6 self-center lg:self-start w-full">
					<div className="flex justify-between items-center  border-b-2 border-gray-300 pb-4">
						<h2 className="text-3xl dark:text-white font-bold">
							Latest Articles
						</h2>
						<Link href="/blog">
							<a className="text-base bg-gray-200 dark:bg-gray-800 p-2 rounded">
								View More
							</a>
						</Link>
					</div>

					<div className="space-y-4">
						{articles.map((article) => (
							<div className="flex flex-col" key={article.id}>
								<Link href={`/blog/${article.id}`}>
									<a className="text-xl font-bold lg:text-xl dark:text-gray-200">
										{article.title}
									</a>
								</Link>
								<span className="text-gray-700 dark:text-gray-400 text-base lg:text-lg">
									{convertDate(article.date, "PPP")}
								</span>
							</div>
						))}
					</div>
				</section>
				<section className="space-y-6 self-center lg:self-start w-full flex flex-col">
					<div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
						<h2 className="text-3xl dark:text-white font-bold ">Projects</h2>
						<a
							href="https://github.com/inezabonte?tab=repositories"
							target="_blank"
							rel="noopener noreferrer"
							className="text-base bg-gray-200 dark:bg-gray-800 p-2 rounded"
						>
							View More
						</a>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 self-center gap-4 lg:gap-6">
						{starredRepos.map((repo) => (
							<div
								key={repo.id}
								className="p-4 border-2 border-gray-300 dark:border-gray-700 rounded space-y-2 max-w-md"
							>
								<div className="flex justify-between">
									<a
										href={repo.homepage}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xl font-bold lg:text-2xl"
									>
										{repo.name}
									</a>
									<a
										href={repo.html_url}
										target="_blank"
										rel="noopener noreferrer"
										className="self-start"
										aria-label="Github repo (opens in new tab)"
									>
										<FaGithub className="text-2xl" />
									</a>
								</div>
								<p className="text-lg text-gray-700 dark:text-gray-400">
									{repo.description}
								</p>
							</div>
						))}
					</div>
				</section>
				<section className="space-y-6 self-center lg:self-start w-full flex flex-col">
					<div className="border-b-2 border-gray-300 pb-4">
						<h2 className="text-3xl dark:text-white font-bold ">
							Contributions to OSS
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 self-center  gap-4 lg:gap-6">
						{contributions.map((repo) => (
							<div
								key={repo.id}
								className="p-4 border-2 border-gray-300 dark:border-gray-700 rounded space-y-2 max-w-md"
							>
								<div className="flex justify-between">
									<h2 className="dark:text-white text-xl font-bold lg:text-2xl">
										{repo.name}
									</h2>
									<a
										href={repo.html_url}
										target="_blank"
										rel="noopener noreferrer"
										className="self-start"
										aria-label="GitHub repo (opens in new tab)"
									>
										<FaGithub className="text-2xl" />
									</a>
								</div>
								<p className="text-lg text-gray-700 dark:text-gray-400">
									{repo.description}
								</p>
							</div>
						))}
					</div>
				</section>
			</main>
		</Layout>
	);
}

export const getStaticProps = async () => {
	const articles = getAllFilesFrontMatter("articles");
	const githubStarred = await getGitHubStars();
	const githubContributions = await getGitHubContributions();
	await generateRssFeed();

	return {
		props: {
			starredRepos: githubStarred,
			contributions: githubContributions,
			articles: articles.splice(0, 3),
		},
		revalidate: 60,
	};
};
