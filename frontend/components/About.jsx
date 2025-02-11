import React from "react";

const post = {
	title: "How to Render React with Go",
	content:
		"This blog post will guide you through the process of rendering React components using Go. We'll start by setting up a basic Go server and then integrate it with a React frontend.",
};

export function About() {
	return (
		<div className="blog-post-container">
			<h1 className="blog-post-title">{post.title}</h1>
			<p className="blog-post-content">{post.content}</p>
		</div>
	);
}

About.$$typeof = Symbol.for('react.server.component');

export default About;
