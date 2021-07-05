import { useState } from "react";
import Dropzone from "react-dropzone";
import Loader from "react-loader-spinner";

import "./App.css";

function App() {
	const [video, setVideo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleDrop = async acceptedFiles => {
		const formData = new FormData();

		acceptedFiles.forEach(file => {
			formData.append("images", file, file.name);
		});

		setLoading(true);
		try {
			const response = await fetch("http://localhost:5000/convert", {
				method: "POST",
				body: formData
			});

			if (response.status > 399) {
				const error = await response.json();
				setLoading(false);
				return setError(error.message);
			}

			const blob = await response.blob();
			const url = await URL.createObjectURL(blob);
			setVideo(url);
		} catch (e) {
			console.error(e);
			setError(e.message);
		}
		setLoading(false);
	};

	return (
		<div className="App">
			<span className="title">
				imgs<strong className="two">2</strong>vid
			</span>
			{!video ? (
				<Dropzone onDrop={handleDrop}>
					{({ getRootProps, getInputProps }) => (
						<section className="dropzone">
							{!loading ? (
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<p>Drop images here</p>
									<p className="warning">
										*All images should have same extension
									</p>
									{error && (
										<p className="error">Error: {error}</p>
									)}
								</div>
							) : (
								<Loader
									type="TailSpin"
									color="#216CFF"
									height={65}
									width={65}
								/>
							)}
						</section>
					)}
				</Dropzone>
			) : (
				<video
					className="video"
					width="630px"
					height="420px"
					muted
					src={video}
					controls
					type="video/webm"
				></video>
			)}
		</div>
	);
}

export default App;
