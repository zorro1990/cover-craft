import { render, screen, fireEvent } from '@testing-library/react'
import { ExportDialog, ExportOptions } from '@/components/editor/ExportDialog'

describe('ExportDialog', () => {
  const mockOnClose = jest.fn()
  const mockOnExport = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when closed', () => {
    render(
      <ExportDialog
        isOpen={false}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    expect(screen.queryByText('导出设置')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    expect(screen.getByText('导出设置')).toBeInTheDocument()
    expect(screen.getByText('PNG')).toBeInTheDocument()
    expect(screen.getByText('JPEG')).toBeInTheDocument()
  })

  it('should select format', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    const jpegButton = screen.getByText('JPEG')
    fireEvent.click(jpegButton)

    expect(jpegButton).toHaveClass('bg-blue-500')
  })

  it('should select quality', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    const quality2x = screen.getByText('2x')
    fireEvent.click(quality2x)

    expect(quality2x).toHaveClass('bg-blue-500')
  })

  it('should toggle transparent background', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(checkbox).toBeChecked()
  })

  it('should call onExport with correct options', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    // 选择 JPEG, 2x, 不透明
    fireEvent.click(screen.getByText('JPEG'))
    fireEvent.click(screen.getByText('2x'))

    const exportButton = screen.getByText('导出')
    fireEvent.click(exportButton)

    expect(mockOnExport).toHaveBeenCalledWith({
      format: 'jpeg',
      quality: 2,
      transparent: false,
    })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when cancel clicked', () => {
    render(
      <ExportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    )

    const cancelButton = screen.getByText('取消')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
    expect(mockOnExport).not.toHaveBeenCalled()
  })
})
