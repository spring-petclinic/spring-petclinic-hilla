package org.springframework.samples.petclinic.endpoint;

import java.util.Comparator;
import java.util.List;

import org.springframework.samples.petclinic.backend.owner.Owner;
import org.springframework.samples.petclinic.backend.owner.OwnerRepository;
import org.springframework.samples.petclinic.backend.owner.Pet;
import org.springframework.samples.petclinic.backend.owner.PetRepository;
import org.springframework.samples.petclinic.backend.visit.Visit;
import org.springframework.samples.petclinic.backend.visit.VisitRepository;
import org.springframework.samples.petclinic.endpoint.record.VisitCreateRecord;
import org.springframework.samples.petclinic.endpoint.record.VisitRecord;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class VisitService {

	private final VisitRepository visitRepository;
	private final OwnerRepository ownerRepository;
	private final PetRepository petRepository;

	public VisitService(VisitRepository visitRepository, OwnerRepository ownerRepository, PetRepository petRepository) {
		this.visitRepository = visitRepository;
		this.ownerRepository = ownerRepository;
		this.petRepository = petRepository;
	}

	public VisitCreateRecord get(Integer ownerId, Integer petId) {

		final Owner owner = ownerRepository.findById(ownerId).get();

		final Pet pet = petRepository.findById(petId).get();

		final List<VisitRecord> previousVisits = visitRepository.findVisitsByPetId(petId);
		previousVisits.sort(Comparator.comparing(VisitRecord::date).reversed());
		VisitCreateRecord model = new VisitCreateRecord(ownerId, petId,
			pet.getName(), pet.getBirthDate(),
			pet.getType().getName(),
			owner.getFirstName() + " " + owner.getLastName(),
			null,
			"",
			previousVisits);
		return model;
	}

	public void saveVisit(VisitCreateRecord model) {
		final Visit visit = new Visit();
		visit.setDate(model.visitDate());
		visit.setDescription(model.description());
		visit.setPetId(model.petId());
		visitRepository.save(visit);
	}

}
