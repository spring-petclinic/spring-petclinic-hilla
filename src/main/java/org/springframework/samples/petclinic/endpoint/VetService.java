package org.springframework.samples.petclinic.endpoint;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.samples.petclinic.backend.vet.Specialty;
import org.springframework.samples.petclinic.backend.vet.VetRepository;
import org.springframework.samples.petclinic.endpoint.record.VetRecord;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class VetService {

	private final VetRepository vetRepository;

	public VetService(VetRepository vetRepository) {
		this.vetRepository = vetRepository;
	}

	public Collection<VetRecord> findAllVets() {
		return vetRepository.findAll().stream().map(vet ->
			new VetRecord(vet.getId(), vet.getFirstName() + " " + vet.getLastName(),
				vet.getSpecialties().isEmpty()
				? "none"
				: vet.getSpecialties().stream().map(Specialty::getName)
				.collect(Collectors.joining(", ")))
		).toList();
	}
}
