package org.springframework.samples.petclinic.endpoint.record;

import java.time.LocalDate;

public record VisitRecord(
	LocalDate date,
	String description,
	Integer petId) {
}
