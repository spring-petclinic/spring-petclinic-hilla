package org.springframework.samples.petclinic.endpoint;

import java.util.List;

import org.springframework.samples.petclinic.backend.owner.Owner;
import org.springframework.samples.petclinic.backend.owner.OwnerRepository;
import org.springframework.samples.petclinic.backend.owner.Pet;
import org.springframework.samples.petclinic.backend.owner.PetRepository;
import org.springframework.samples.petclinic.backend.owner.PetType;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class PetService {

	private final PetRepository petRepository;
	private final OwnerRepository ownerRepository;

	public PetService(OwnerRepository ownerRepository, PetRepository petRepository) {
		this.petRepository = petRepository;
		this.ownerRepository = ownerRepository;
	}

	public Pet savePet(Pet pet,Integer ownerId) {
		Owner owner = ownerRepository.findById(ownerId).get();
		owner.addPet(pet);
		return getRepository().save(pet);
	}

	public Pet update(Pet model) {
		//
		Pet pet = petRepository.findById(model.getId()).get();
		pet.setName(model.getName());
		pet.setBirthDate(model.getBirthDate());
		pet.setType(model.getType());
		return getRepository().save(pet);
	}
	public List<PetType> findPetTypes(){
		return getRepository().findPetTypes();
	}

	public PetRepository getRepository() {
		return petRepository;
	}

	public Pet findPetById(Integer petId) {
		return getRepository().findById(petId).get();
	}
}
