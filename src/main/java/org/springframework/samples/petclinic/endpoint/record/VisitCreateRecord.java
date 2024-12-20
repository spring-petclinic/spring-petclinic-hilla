package org.springframework.samples.petclinic.endpoint.record;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record VisitCreateRecord(
	Integer ownerId,
	Integer petId,
	String petName,
	LocalDate petBirthDate,
	String petType,
	String petOwner,
	@NotNull(message="The date is required")
	LocalDate visitDate,
	@NotEmpty(message="The description is required")
	String description,
	@NotNull
	List<VisitRecord> previousVisits) {
}
