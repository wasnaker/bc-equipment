import { Equipment } from '../../../../domain/equipment';
import { EquipmentEntity } from '../entities/equipment.entity';
export declare class EquipmentMapper {
    static toDomain(raw: EquipmentEntity): Equipment;
    static toPersistence(value: Partial<Equipment>): EquipmentEntity;
}
