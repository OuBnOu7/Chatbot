import {
	Card,
	CardBody,
	CardHeader,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	Spinner,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function formatJsonData(data) {
	if (Array.isArray(data)) {
		return data.map(formatJsonData);
	} else if (typeof data === "object" && data !== null) {
		return Object.fromEntries(
			Object.entries(data).map(([key, value]) => [
				formatText(key),
				formatJsonData(value),
			])
		);
	} else if (typeof data === "string") {
		return formatText(data);
	}
	return data;
}

function formatText(text) {
	return text.replace(/_/g, " ");
}

export default function Formations() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [formations, setFormations] = useState([]);
	const [selectedFormation, setSelectedFormation] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:5000/");
				const data = await response.json();
				const formattedData = formatJsonData(data);
				setFormations(formattedData);
			} catch (error) {
				console.error("Error fetching formations:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleCardClick = (formation) => {
		setSelectedFormation(formation);
		onOpen();
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
				gap: "2rem",
				padding: "4rem",
			}}
		>
			{loading ? (
				<Spinner size="xl" />
			) : (
				formations.map((formation, index) => (
					<Card
						key={index}
						variant="elevated"
						onClick={() => handleCardClick(formation)}
						cursor="pointer"
					>
						<CardHeader>
							<Heading size="md">{formation.formation}</Heading>
						</CardHeader>
						<CardBody>
							<Text>
								<strong>École:</strong> {formation.school}
							</Text>
							<Text>
								<strong>Type de formation:</strong> {formation.type}
							</Text>
							<Text>
								<strong>Volume horaire global:</strong> {formation.duration}{" "}
								heures
							</Text>
						</CardBody>
					</Card>
				))
			)}

			{selectedFormation && (
				<Modal isOpen={isOpen} onClose={onClose} style={{ padding: "2rem" }}>
					<ModalOverlay />
					<ModalContent maxW="800px">
						<ModalHeader display="flex" alignItems="center" gap="10px">
							{selectedFormation.formation}
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody
							pb={6}
							style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
						>
							<Text>
								<strong>École:</strong> {selectedFormation.school}
							</Text>
							<Text>
								<strong>Type de formation:</strong> {selectedFormation.type}
							</Text>
							<Text>
								<strong>Volume horaire global:</strong>{" "}
								{selectedFormation.duration} heures
							</Text>
							<Text>
								<strong>Prérequis académique:</strong>{" "}
								{selectedFormation["Prérequis académique"] || "N/A"}
							</Text>
							<Text>
								<strong>Coût de formation:</strong>{" "}
								{selectedFormation.cout || "N/A"}
							</Text>
							{selectedFormation.ues && selectedFormation.ues.length > 0 && (
								<>
									<Accordion allowToggle>
										<AccordionItem>
											<h2>
												<AccordionButton>
													<Box as="span" flex="1" textAlign="left">
														<strong>Programme détaillé</strong>
													</Box>
													<AccordionIcon />
												</AccordionButton>
											</h2>
											<AccordionPanel pb={4}>
												<Table variant="simple">
													<Thead>
														<Tr>
															<Th>UE</Th>
															<Th>ECUE</Th>
															<Th>Volume horaire</Th>
														</Tr>
													</Thead>
													<Tbody>
														{selectedFormation.ues.map((ue, idx) =>
															ue.ecues.map((ecue, ecIdx) => (
																<Tr key={`${idx}-${ecIdx}`}>
																	{ecIdx === 0 ? (
																		<Td
																			rowSpan={ue.ecues.length}
																			fontWeight="bold"
																		>
																			{ue.label}
																		</Td>
																	) : null}
																	<Td>{ecue.ecue}</Td>
																	<Td style={{ textAlign: "center" }}>
																		{ecue.duration
																			? `${ecue.duration} heures`
																			: "-"}
																	</Td>
																</Tr>
															))
														)}
													</Tbody>
												</Table>
											</AccordionPanel>
										</AccordionItem>
									</Accordion>
								</>
							)}
						</ModalBody>
					</ModalContent>
				</Modal>
			)}
		</div>
	);
}
