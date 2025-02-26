import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../common/dto/AbstractDto";

export class SubscriptionStatusDto extends AbstractDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: String })
  customerId: string;

  @ApiProperty({ type: String })
  orgId: string;

  @ApiProperty({ type: String })
  subscriptionId: string;

  @ApiProperty({ type: Boolean })
  is_active: boolean;

  @ApiProperty({ type: Boolean })
  is_cancelled: boolean;
}
