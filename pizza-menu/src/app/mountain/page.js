import { useEffect, useState } from "react";
async function getData() {
	const res = await fetch("/lifts");
	return res.json();
}
// export default function MountainPage() {
//   const data = getData();

//   return (
//     <main>
//       <h1>Mountain Page</h1>
//       <p>Mountain data: {JSON.stringify(data)}</p>
//     </main>
//   );
// }

export default function MountainPage() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch("/lifts")
			.then((res) => {
				if (!res.ok) throw new Error("Network response was not ok");
				return res.json();
			})
			.then(setData)
			.catch((err) => setError(err.message));
	}, []);

	if (!data) {
		return (
			<main>
				<h1>Mountain Page</h1>
				<p>Loading...</p>
			</main>
		);
	}

	return (
		<main>
			<h1>Mountain Page</h1>
			<table>
				<thead>
					<tr>
						<th>Lift Name</th>
						<th>Current Status</th>
					</tr>
				</thead>
				<tbody>
					{data.map((lift) => (
						<tr key={lift.id}>
							<td>{lift.name}</td>
							<td>{lift.status}</td>
						</tr>
					)
					)}
				</tbody>
			</table>
		</main>
	);
}