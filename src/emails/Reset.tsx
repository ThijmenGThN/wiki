import { Body, Head, Html, Link, Text } from "@react-email/components"

export default function Reset({ ACTION_URL }: { ACTION_URL: string }) {
	const colors = {
		brand: "#11999e",
		background: "#FAFAFA",
		white: "#FFFFFF",
		lightGray: "#F2F4F8",
		text: "#263238",
		secondaryText: "#546E7A",
		borderColor: "#E0E0E0",
	}

	return (
		<Html>
			<Head>
				<style>
					{`
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; }
              .mobile-padding { padding: 30px 20px !important; }
              .header-padding { padding: 20px !important; }
              .stack-on-mobile { display: block !important; width: 100% !important; }
              .center-on-mobile { text-align: center !important; }
            }
          `}
				</style>
			</Head>
			<Body
				style={{
					margin: "0",
					padding: "0",
					backgroundColor: colors.background,
					fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
					color: colors.text,
					WebkitFontSmoothing: "antialiased",
				}}
			>
				<table
					width="100%"
					cellPadding="0"
					cellSpacing="0"
					border={0}
					style={{ backgroundColor: colors.background }}
				>
					<tr>
						<td align="center" style={{ padding: "10px" }}>
							<table
								className="container"
								cellPadding="0"
								cellSpacing="0"
								border={0}
								style={{
									maxWidth: "600px",
									width: "100%",
									margin: "0 auto",
								}}
							>
								{/* Minimalist header */}
								<tr>
									<td>
										<table width="100%" cellPadding="0" cellSpacing="0" border={0}>
											<tr>
												<td style={{ padding: "30px 40px" }} className="header-padding">
													<table width="100%" cellPadding="0" cellSpacing="0" border={0}>
														<tr>
															<td>
																<table cellPadding="0" cellSpacing="0" border={0}>
																	<tr>
																		<td
																			style={{
																				width: "32px",
																				height: "32px",
																				borderRadius: "8px",
																				backgroundColor: colors.brand,
																			}}
																		>
																			<Text
																				style={{
																					margin: "0",
																					color: colors.white,
																					fontWeight: "700",
																					fontSize: "18px",
																					lineHeight: "32px",
																					textAlign: "center",
																				}}
																			>
																				N
																			</Text>
																		</td>
																		<td style={{ paddingLeft: "12px" }}>
																			<Text
																				style={{
																					margin: "0",
																					color: colors.text,
																					fontWeight: "600",
																					fontSize: "18px",
																				}}
																			>
																				next-leaflet
																			</Text>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</td>
								</tr>

								{/* Main content card */}
								<tr>
									<td>
										<table
											width="100%"
											cellPadding="0"
											cellSpacing="0"
											border={0}
											style={{
												backgroundColor: colors.white,
												borderRadius: "16px",
												boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
												overflow: "hidden",
											}}
										>
											{/* Content area */}
											<tr>
												<td style={{ padding: "40px" }} className="mobile-padding">
													{/* Main heading */}
													<table
														width="100%"
														cellPadding="0"
														cellSpacing="0"
														border={0}
														style={{ marginBottom: "20px" }}
													>
														<tr>
															<td align="center">
																<Text
																	style={{
																		fontSize: "24px",
																		fontWeight: "700",
																		color: colors.text,
																		margin: "0",
																		letterSpacing: "-0.5px",
																	}}
																>
																	Reset your password
																</Text>
															</td>
														</tr>
													</table>

													{/* Subheading */}
													<table
														width="100%"
														cellPadding="0"
														cellSpacing="0"
														border={0}
														style={{ marginBottom: "35px" }}
													>
														<tr>
															<td align="center">
																<Text
																	style={{
																		fontSize: "16px",
																		fontWeight: "normal",
																		color: colors.secondaryText,
																		margin: "0",
																		lineHeight: "1.5",
																	}}
																>
																	Click the button below to securely reset your password
																</Text>
															</td>
														</tr>
													</table>

													{/* Action button */}
													<table
														width="100%"
														cellPadding="0"
														cellSpacing="0"
														border={0}
														style={{ marginBottom: "35px" }}
													>
														<tr>
															<td align="center">
																<table cellPadding="0" cellSpacing="0" border={0}>
																	<tr>
																		<td
																			style={{
																				backgroundColor: colors.brand,
																				borderRadius: "7.5px",
																				overflow: "hidden",
																			}}
																		>
																			<Link
																				href={ACTION_URL}
																				style={{
																					display: "inline-block",
																					color: colors.white,
																					fontSize: "15px",
																					fontWeight: "600",
																					textDecoration: "none",
																					padding: "10px 32px",
																					letterSpacing: "0.3px",
																				}}
																			>
																				Reset Password
																			</Link>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>

													{/* Divider */}
													<table
														width="100%"
														cellPadding="0"
														cellSpacing="0"
														border={0}
														style={{ marginBottom: "25px" }}
													>
														<tr>
															<td
																style={{
																	height: "1px",
																	backgroundColor: colors.borderColor,
																	opacity: "0.5",
																}}
															></td>
														</tr>
													</table>

													{/* Security note */}
													<table width="100%" cellPadding="0" cellSpacing="0" border={0}>
														<tr>
															<td align="center">
																<Text
																	style={{
																		fontSize: "14px",
																		color: colors.secondaryText,
																		margin: "0",
																		lineHeight: "1.5",
																		textAlign: "center",
																	}}
																>
																	If you did not request this email, you can ignore it.
																	<br />
																	Your password will remain unchanged.
																</Text>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</td>
								</tr>

								{/* Footer */}
								<tr>
									<td style={{ padding: "20px 20px" }}>
										<table width="100%" cellPadding="0" cellSpacing="0" border={0}>
											<tr>
												<td align="left" style={{ width: "50%" }}>
													<Text
														style={{
															fontSize: "13px",
															color: colors.secondaryText,
															margin: "0",
															lineHeight: "1.5",
														}}
													>
														© 2025 next-leaflet, all rights reserved.
													</Text>
												</td>
												<td align="right" style={{ width: "50%" }}>
													<Text
														style={{
															fontSize: "13px",
															color: colors.secondaryText,
															margin: "0",
															lineHeight: "1.5",
														}}
													>
														next@leaflet.app 010 123 4567
													</Text>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</Body>
		</Html>
	)
}
