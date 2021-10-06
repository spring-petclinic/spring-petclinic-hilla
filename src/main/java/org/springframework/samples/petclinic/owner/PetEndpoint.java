package org.springframework.samples.petclinic.owner;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.samples.petclinic.dto.PetDTO;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.fusion.Endpoint;
import com.vaadin.fusion.Nonnull;

@Endpoint
@AnonymousAllowed
public class PetEndpoint {

	private PetRepository service;

	private OwnerRepository ownerService;

	private ModelMapper modelMapper;

	public PetEndpoint(PetRepository service, OwnerRepository ownerService, ModelMapper modelMapper) {
		this.service = service;
		this.ownerService = ownerService;
		this.modelMapper = modelMapper;
	}

	@Nonnull
	public List<@Nonnull PetType> findPetTypes() {
		return service.findPetTypes();
	}

	public PetDTO findById(Integer id) {
		return convertToDto(service.findById(id));
	}

	@Nonnull
	public Integer save(PetDTO pet) {
		return service.save(convertToEntity(pet)).getId();
	}

	private PetDTO convertToDto(Pet pet) {
		return modelMapper.map(pet, PetDTO.class);
	}

	private Pet convertToEntity(PetDTO petDto) {
		Pet pet = modelMapper.map(petDto, Pet.class);
		Owner owner = ownerService.findById(petDto.getOwnerId());
		pet.setOwner(owner);

		if (petDto.getId() != null) {
			Pet oldPet = service.findById(petDto.getId());
			pet.setVisitsInternal(oldPet.getVisitsInternal());
		}
		return pet;
	}

}
